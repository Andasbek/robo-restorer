# backend/sensors/serial_reader.py

import time
from typing import Optional, Dict

import serial
from backend.sensors.parser import parse_sensor_line
from backend import config

class SerialReader:
    def __init__(self, port: str = None, baudrate: int = None):
        self.port = port or config.SERIAL_PORT
        self.baudrate = baudrate or config.BAUD_RATE
        self.ser: Optional[serial.Serial] = None

    def connect(self):
        self.ser = serial.Serial(self.port, self.baudrate, timeout=2)
        # Небольшая пауза после открытия
        time.sleep(2)

    def read_once(self) -> Optional[Dict[str, float]]:
        if self.ser is None:
            raise RuntimeError("Serial не подключен. Вызови connect() сначала.")
        line = self.ser.readline().decode(errors="ignore")
        return parse_sensor_line(line)

    def close(self):
        if self.ser is not None and self.ser.is_open:
            self.ser.close()
