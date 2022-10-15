export type RawPacket = Buffer

interface DeviceData {
  system: {
    operationalMode: number
    measurementFlag: number
    systemTickCount: number
    sdCardBlockIndex: number
  }
  connectionStatus: {
    lastPingTick: number
    hasConnection: number
  }
  deviceSettings: {
    averageOptical: number
    averageFPGA: number
    analogToDigitalConverter: number
    acceleroGyro: ArrayBuffer
    magneto: ArrayBuffer
    devicesInitialized: {
      sdCard: number
      magnetometer: number
      accelerometer: number
      gyroscope: number
      analogToDigitalConverter: number
      laser: number
      microwave: number
      attenuator: number
    }
  }
}

interface MicrowaveData {
  minimumFrequency: number
  maximumFrequency: number
  attenuation: number
  steps: number
  broadSteps: number
  settings: {
    register0: {
      int: number
      fract: number
      control: number
    },
    register1: {
      modulus: number
      control: number
    },
    register2: {
      data: number,
      control: number
    },
    register3: {
      data: number
      control: number
    },
    register4: {
      enabled: number
      control: number
    },
    register5: {
      data: number,
      control: number
    },
  }
  frequencySkips: number
  broadSweepSteps: number
}

interface LaserData {
  temperature: number
  status: number
  error: number
  potentiometerValue: number
}

interface ReferenceData {
  x: number
  y: number
  z: number
}

interface ReferenceTemperatureData {
  referenceTemperature: number
}

interface MeasurementData {
  ODMR: number[]
}

interface DataPacket {
  measurement: MeasurementData
  referenceTemp: ReferenceTemperatureData
  referenceGyroscope: ReferenceData
  referenceAccelerometer: ReferenceData
  referenceMagnetometer: ReferenceData
}

interface InfoPacket {
  laserData: LaserData
  microwaveData: MicrowaveData
  deviceData: DeviceData
}

export interface QUBEPacket {
  appID: number
  data: DataPacket
  info: InfoPacket
}
