from backend.sensors.parser import parse_sensor_line

def test_parse_valid_line():
    line = "TEMP:23.4,HUM:45.6,LIGHT:512"
    result = parse_sensor_line(line)
    assert result is not None
    assert result["temperature"] == 23.4
    assert result["humidity"] == 45.6
    assert result["light"] == 512.0

def test_parse_valid_line_with_spaces():
    line = " TEMP : 23.4 , HUM : 45.6 , LIGHT : 512 "
    result = parse_sensor_line(line)
    assert result is not None
    assert result["temperature"] == 23.4

def test_parse_lowercase():
    # code expects uppercase keys if split by ":" creates keys? 
    # Let's check implementation behavior: 
    # key, value = part.split(":") 
    # data[key.strip().upper()] = ...
    # So "temp:23.4" -> key="temp" -> upper() -> "TEMP".
    line = "temp:23.4,hum:45.6,light:512"
    result = parse_sensor_line(line)
    assert result is not None
    assert result["temperature"] == 23.4

def test_parse_invalid_format():
    line = "NOT VALID DATA"
    result = parse_sensor_line(line)
    # The code does catch Exception, but split(",") on "NOT VALID DATA" 
    # gives ["NOT VALID DATA"]. Then part.split(":") raises ValueError.
    # So it should return None.
    assert result is None

def test_parse_empty():
    result = parse_sensor_line("")
    assert result is None
