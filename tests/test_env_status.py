from backend.sensors.env_status import evaluate_environment

def test_evaluate_environment_danger():
    # TEST CASE 1: High Temperature -> DANGER
    data = {"temperature": 35.0, "humidity": 40.0, "light": 100.0}
    assert evaluate_environment(data) == "DANGER"

    # TEST CASE 2: High Humidity -> DANGER
    data = {"temperature": 20.0, "humidity": 80.0, "light": 100.0}
    assert evaluate_environment(data) == "DANGER"
    
    # TEST CASE 3: High Light -> DANGER
    data = {"temperature": 20.0, "humidity": 40.0, "light": 900.0}
    assert evaluate_environment(data) == "DANGER"

def test_evaluate_environment_warning():
    # TEST CASE 1: Warning Temperature
    data = {"temperature": 26.0, "humidity": 40.0, "light": 100.0}
    assert evaluate_environment(data) == "WARNING"

    # TEST CASE 2: Warning Humidity
    data = {"temperature": 20.0, "humidity": 65.0, "light": 100.0}
    assert evaluate_environment(data) == "WARNING"

def test_evaluate_environment_ok():
    data = {"temperature": 22.0, "humidity": 45.0, "light": 300.0}
    assert evaluate_environment(data) == "OK"

def test_evaluate_environment_empty():
    data = {}
    assert evaluate_environment(data) == "OK"
