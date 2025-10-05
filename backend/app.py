from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import math

app = Flask(__name__)
CORS(app)

DATABASE = 'asteroid_simulator.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with users table"""
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            verification_token TEXT,
            verified INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    db.commit()
    db.close()

@app.route('/api/users/create', methods=['POST'])
def create_user():
    """Create a new user account"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        verification_token = data.get('verificationToken')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        db = get_db()
        
        # Check if user already exists
        existing_user = db.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409

        # Insert new user
        db.execute(
            'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)',
            (email, password, verification_token)
        )
        db.commit()
        db.close()

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/users/login', methods=['POST'])
def login_user():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        db = get_db()
        user = db.execute(
            'SELECT id, email, verified FROM users WHERE email = ? AND password = ?',
            (email, password)
        ).fetchone()
        db.close()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not user['verified']:
            return jsonify({'error': 'Please verify your email before logging in'}), 403

        return jsonify({
            'id': user['id'],
            'email': user['email'],
            'verified': user['verified']
        }), 200

    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/users/verify', methods=['POST'])
def verify_user():
    """Verify user email"""
    try:
        data = request.json
        token = data.get('token')

        if not token:
            return jsonify({'error': 'Verification token is required'}), 400

        db = get_db()
        user = db.execute(
            'SELECT id FROM users WHERE verification_token = ?',
            (token,)
        ).fetchone()

        if not user:
            return jsonify({'error': 'Invalid verification token'}), 404

        db.execute(
            'UPDATE users SET verified = 1, verification_token = NULL WHERE verification_token = ?',
            (token,)
        )
        db.commit()
        db.close()

        return jsonify({'message': 'Email verified successfully'}), 200

    except Exception as e:
        print(f"Error verifying user: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Physics calculation functions
def calculate_mass(diameter_m, density_kg_m3):
    """Calculate asteroid mass from diameter and density"""
    radius = diameter_m / 2
    volume = (4/3) * math.pi * (radius ** 3)
    mass = volume * density_kg_m3
    return mass

def calculate_kinetic_energy(mass_kg, velocity_km_s):
    """Calculate kinetic energy in joules"""
    velocity_m_s = velocity_km_s * 1000
    kinetic_energy = 0.5 * mass_kg * (velocity_m_s ** 2)
    return kinetic_energy

def joules_to_megatons(joules):
    """Convert joules to megatons of TNT"""
    # 1 megaton = 4.184e15 joules
    megatons = joules / 4.184e15
    return megatons

def calculate_crater_diameter(energy_joules, angle_deg, target_type='land'):
    """Calculate crater diameter based on impact energy and angle"""
    # Simplified crater scaling law
    # D = k * E^0.25 where D is diameter, E is energy, k is constant
    
    # Adjust for angle (steep angles create deeper, smaller craters)
    angle_factor = math.sin(math.radians(angle_deg))
    
    # Target type factor (water absorbs more energy)
    target_factor = 0.7 if target_type == 'ocean' else 1.0
    
    # Base crater diameter in meters
    k = 0.0013  # Empirical constant
    crater_diameter = k * (energy_joules ** 0.25) * angle_factor * target_factor
    
    return crater_diameter

def calculate_crater_depth(crater_diameter, angle_deg):
    """Calculate crater depth from diameter and angle"""
    # Typical depth-to-diameter ratio is 1:5 to 1:10
    # Steeper angles create deeper craters
    angle_factor = math.sin(math.radians(angle_deg))
    depth_ratio = 0.15 + (0.05 * angle_factor)  # 0.15 to 0.20
    crater_depth = crater_diameter * depth_ratio
    return crater_depth

def calculate_fireball_radius(energy_joules):
    """Calculate fireball radius in meters"""
    # Empirical formula based on nuclear explosion scaling
    megatons = joules_to_megatons(energy_joules)
    fireball_radius = 440 * (megatons ** 0.4)
    return fireball_radius

def calculate_blast_radius(energy_joules, overpressure_psi):
    """Calculate blast radius for given overpressure"""
    # Overpressure levels:
    # 20 psi: Total destruction
    # 5 psi: Most buildings collapse
    # 1 psi: Window breakage
    
    megatons = joules_to_megatons(energy_joules)
    
    # Scaling law for blast radius
    if overpressure_psi >= 20:
        radius = 0.28 * (megatons ** 0.33) * 1000  # meters
    elif overpressure_psi >= 5:
        radius = 0.62 * (megatons ** 0.33) * 1000
    elif overpressure_psi >= 1:
        radius = 2.2 * (megatons ** 0.33) * 1000
    else:
        radius = 5.0 * (megatons ** 0.33) * 1000
    
    return radius

def calculate_seismic_magnitude(energy_joules):
    """Calculate Richter scale magnitude"""
    # Gutenberg-Richter relation
    magnitude = (2/3) * math.log10(energy_joules) - 10.7
    return max(0, magnitude)

def calculate_thermal_radiation(energy_joules, distance_m):
    """Calculate thermal radiation at given distance"""
    # Thermal radiation decreases with square of distance
    total_thermal = energy_joules * 0.35  # ~35% of energy as thermal
    if distance_m == 0:
        return float('inf')
    
    # Energy per square meter at distance
    area = 4 * math.pi * (distance_m ** 2)
    thermal_flux = total_thermal / area  # J/m²
    
    return thermal_flux

def calculate_ejecta_volume(crater_diameter, crater_depth):
    """Calculate volume of ejected material"""
    # Approximate crater as a paraboloid
    crater_radius = crater_diameter / 2
    volume = (math.pi / 2) * (crater_radius ** 2) * crater_depth
    return volume

def calculate_tsunami_height(energy_joules, distance_km, water_depth_m=4000):
    """Calculate tsunami wave height for ocean impacts"""
    megatons = joules_to_megatons(energy_joules)
    
    # Simplified tsunami model
    # Initial wave height depends on energy
    initial_height = 10 * (megatons ** 0.5)  # meters
    
    # Wave height decreases with distance
    distance_m = distance_km * 1000
    if distance_m == 0:
        return initial_height
    
    # Decay factor
    decay = math.exp(-distance_m / (water_depth_m * 100))
    wave_height = initial_height * decay
    
    return max(0, wave_height)

def is_global_catastrophe(energy_joules):
    """Determine if impact causes global catastrophe"""
    megatons = joules_to_megatons(energy_joules)
    # Threshold: ~1 million megatons (1 km diameter at 20 km/s)
    return megatons > 1e6

def compare_to_hiroshima(energy_joules):
    """Compare impact energy to Hiroshima bomb"""
    # Hiroshima: ~15 kilotons = 0.015 megatons
    hiroshima_joules = 0.015 * 4.184e15
    ratio = energy_joules / hiroshima_joules
    return ratio

def compare_to_nagasaki(energy_joules):
    """Compare impact energy to Nagasaki bomb"""
    # Nagasaki: ~21 kilotons = 0.021 megatons
    nagasaki_joules = 0.021 * 4.184e15
    ratio = energy_joules / nagasaki_joules
    return ratio

@app.route('/api/simulate', methods=['POST'])
def simulate_impact():
    """Calculate asteroid impact physics"""
    try:
        data = request.json
        
        # Input parameters
        diameter_m = float(data.get('diameter', 100))
        density_kg_m3 = float(data.get('density', 3000))
        velocity_km_s = float(data.get('velocity', 20))
        angle_deg = float(data.get('angle', 45))
        composition = data.get('composition', 'stone')
        target_type = data.get('targetType', 'land')
        latitude = float(data.get('latitude', 40.7128))
        longitude = float(data.get('longitude', -74.0060))
        
        # Validate inputs
        if diameter_m <= 0 or velocity_km_s <= 0 or density_kg_m3 <= 0:
            return jsonify({'error': 'Invalid input parameters'}), 400
        
        if angle_deg < 0 or angle_deg > 90:
            return jsonify({'error': 'Angle must be between 0 and 90 degrees'}), 400
        
        # Calculate mass
        mass_kg = calculate_mass(diameter_m, density_kg_m3)
        
        # Calculate kinetic energy
        kinetic_energy_j = calculate_kinetic_energy(mass_kg, velocity_km_s)
        
        # Convert to megatons
        megatons = joules_to_megatons(kinetic_energy_j)
        
        # Calculate crater dimensions
        crater_diameter_m = calculate_crater_diameter(kinetic_energy_j, angle_deg, target_type)
        crater_depth_m = calculate_crater_depth(crater_diameter_m, angle_deg)
        
        # Calculate fireball
        fireball_radius_m = calculate_fireball_radius(kinetic_energy_j)
        
        # Calculate blast radii for different overpressures
        blast_20psi_m = calculate_blast_radius(kinetic_energy_j, 20)
        blast_5psi_m = calculate_blast_radius(kinetic_energy_j, 5)
        blast_1psi_m = calculate_blast_radius(kinetic_energy_j, 1)
        
        # Calculate seismic effects
        seismic_magnitude = calculate_seismic_magnitude(kinetic_energy_j)
        
        # Calculate ejecta
        ejecta_volume_m3 = calculate_ejecta_volume(crater_diameter_m, crater_depth_m)
        
        # Calculate thermal effects at various distances
        thermal_1km = calculate_thermal_radiation(kinetic_energy_j, 1000)
        thermal_10km = calculate_thermal_radiation(kinetic_energy_j, 10000)
        thermal_100km = calculate_thermal_radiation(kinetic_energy_j, 100000)
        
        # Tsunami calculations (if ocean impact)
        tsunami_data = None
        if target_type == 'ocean':
            tsunami_data = {
                'height_10km': calculate_tsunami_height(kinetic_energy_j, 10),
                'height_100km': calculate_tsunami_height(kinetic_energy_j, 100),
                'height_500km': calculate_tsunami_height(kinetic_energy_j, 500),
                'height_1000km': calculate_tsunami_height(kinetic_energy_j, 1000),
            }
        
        # Global catastrophe check
        global_catastrophe = is_global_catastrophe(kinetic_energy_j)
        
        # Historical comparisons
        hiroshima_ratio = compare_to_hiroshima(kinetic_energy_j)
        nagasaki_ratio = compare_to_nagasaki(kinetic_energy_j)
        
        # Prepare response
        result = {
            'input': {
                'diameter_m': diameter_m,
                'density_kg_m3': density_kg_m3,
                'velocity_km_s': velocity_km_s,
                'angle_deg': angle_deg,
                'composition': composition,
                'target_type': target_type,
                'latitude': latitude,
                'longitude': longitude,
            },
            'energy': {
                'mass_kg': mass_kg,
                'kinetic_energy_j': kinetic_energy_j,
                'megatons_tnt': megatons,
            },
            'crater': {
                'diameter_m': crater_diameter_m,
                'diameter_km': crater_diameter_m / 1000,
                'depth_m': crater_depth_m,
                'volume_m3': ejecta_volume_m3,
            },
            'fireball': {
                'radius_m': fireball_radius_m,
                'radius_km': fireball_radius_m / 1000,
            },
            'blast': {
                'total_destruction_m': blast_20psi_m,
                'total_destruction_km': blast_20psi_m / 1000,
                'severe_damage_m': blast_5psi_m,
                'severe_damage_km': blast_5psi_m / 1000,
                'moderate_damage_m': blast_1psi_m,
                'moderate_damage_km': blast_1psi_m / 1000,
            },
            'seismic': {
                'magnitude': seismic_magnitude,
            },
            'thermal': {
                'flux_1km_j_m2': thermal_1km,
                'flux_10km_j_m2': thermal_10km,
                'flux_100km_j_m2': thermal_100km,
            },
            'tsunami': tsunami_data,
            'comparisons': {
                'hiroshima_equivalent': hiroshima_ratio,
                'nagasaki_equivalent': nagasaki_ratio,
            },
            'global_catastrophe': global_catastrophe,
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in simulation: {e}")
        return jsonify({'error': 'Simulation failed', 'details': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
