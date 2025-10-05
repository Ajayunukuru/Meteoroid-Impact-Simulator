"""
Test script for physics calculations
Run this to verify the physics engine is working correctly
"""

import sys
import json
import requests

def test_small_impact():
    """Test a small asteroid impact (Tunguska-like)"""
    print("Testing small impact (Tunguska-like)...")
    
    data = {
        'diameter': 50,  # 50 meters
        'density': 3000,  # stone
        'velocity': 15,  # 15 km/s
        'angle': 45,
        'composition': 'stone',
        'targetType': 'land',
        'latitude': 60.0,
        'longitude': 101.0
    }
    
    response = requests.post('http://localhost:5000/api/simulate', json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Energy: {result['energy']['megatons_tnt']:.2f} MT")
        print(f"✓ Crater diameter: {result['crater']['diameter_km']:.2f} km")
        print(f"✓ Blast radius (5 psi): {result['blast']['severe_damage_km']:.2f} km")
        print(f"✓ Hiroshima equivalent: {result['comparisons']['hiroshima_equivalent']:.0f}x")
        print()
    else:
        print(f"✗ Error: {response.status_code}")
        print()

def test_large_impact():
    """Test a large asteroid impact (Chicxulub-like)"""
    print("Testing large impact (Chicxulub-like)...")
    
    data = {
        'diameter': 10000,  # 10 km
        'density': 3000,
        'velocity': 20,
        'angle': 60,
        'composition': 'stone',
        'targetType': 'land',
        'latitude': 21.0,
        'longitude': -89.0
    }
    
    response = requests.post('http://localhost:5000/api/simulate', json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Energy: {result['energy']['megatons_tnt']:.2e} MT")
        print(f"✓ Crater diameter: {result['crater']['diameter_km']:.2f} km")
        print(f"✓ Global catastrophe: {result['global_catastrophe']}")
        print(f"✓ Seismic magnitude: {result['seismic']['magnitude']:.1f}")
        print()
    else:
        print(f"✗ Error: {response.status_code}")
        print()

def test_ocean_impact():
    """Test an ocean impact with tsunami"""
    print("Testing ocean impact...")
    
    data = {
        'diameter': 500,  # 500 meters
        'density': 3000,
        'velocity': 25,
        'angle': 45,
        'composition': 'stone',
        'targetType': 'ocean',
        'latitude': 0.0,
        'longitude': -140.0
    }
    
    response = requests.post('http://localhost:5000/api/simulate', json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Energy: {result['energy']['megatons_tnt']:.2f} MT")
        print(f"✓ Tsunami height at 100km: {result['tsunami']['height_100km']:.2f} m")
        print(f"✓ Tsunami height at 500km: {result['tsunami']['height_500km']:.2f} m")
        print()
    else:
        print(f"✗ Error: {response.status_code}")
        print()

if __name__ == '__main__':
    print("=" * 50)
    print("Asteroid Impact Physics Engine Test")
    print("=" * 50)
    print()
    
    try:
        test_small_impact()
        test_large_impact()
        test_ocean_impact()
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
    except Exception as e:
        print(f"Error running tests: {e}")
        print("Make sure the Flask backend is running on port 5000")
