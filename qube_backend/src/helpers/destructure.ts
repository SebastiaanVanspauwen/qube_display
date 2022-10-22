import { QUBEPacket, RawPacket } from '../types/packet.type'

function toReadableTemperature (raw: number): number {
  const sqrtSum = Math.pow(-10.888, 2) + (4 * 0.00347) * (1777.3 - raw)
  const numerator = 10.888 - (Math.sqrt(sqrtSum))
  const denominator = -0.00347 * 2
  const transformed = (numerator / denominator) + 30
  return transformed
}

export function destructure (payload: RawPacket): QUBEPacket | undefined {
  const appID = payload.readUInt8(0)
  const VREF = 1250 * 4.096

  if (appID !== 0x0000) return

  const destructured: QUBEPacket = {
    appID: appID,
    data: {
      measurement: {
        ODMR: Array.from(new Uint16Array(payload.buffer.slice(2, 402))
          .map((value) => (value / (2 << 15)) * VREF))
          .map((value) => value / 1000)
      },
      referenceTemp: {
        referenceTemperature: Number((payload.readUInt16LE(402) / 16).toFixed(2)) + 25
      },
      // Todo: find the right conversions.
      referenceGyroscope: {
        x: payload.readInt16LE(404) / 16,
        y: payload.readInt16LE(406) / 16,
        z: payload.readInt16LE(408) / 16
      },
      referenceAccelerometer: {
        x: payload.readInt16LE(410) / 16,
        y: payload.readInt16LE(412) / 16,
        z: payload.readInt16LE(414) / 16
      },
      referenceMagnetometer: {
        x: payload.readInt16LE(416) / 16,
        y: payload.readInt16LE(418) / 16,
        z: payload.readInt16LE(420) / 16
      }
    },
    info: {
      laserData: {
        temperature: Number(toReadableTemperature(new Uint16Array(payload.buffer.slice(422, 438))
          .map((value) => (value / (2 << 11)) * 3300)
          .reduce((acc, value) => acc + value, 0) / 8)
          .toFixed(2)),
        status: payload.readUInt8(440),
        error: payload.readUInt8(441),
        potentiometerValue: payload.readUInt16LE(442)
      },
      microwaveData: {
        minimumFrequency: payload.readUInt16LE(444),
        maximumFrequency: payload.readUInt16LE(446),
        attenuation: payload.readUInt8(448),
        steps: payload.readUInt8(449),
        broadSteps: payload.readUInt8(450),
        settings: {
          // payload.buffer.slice(452, 476)
          register0: {
            int: payload.readInt16LE(453) >> 3,
            fract: payload.readUInt32LE(453) & 0xFC,
            control: payload.readInt16LE(451) & 0x03
          },
          register1: {
            modulus: (payload.readUInt16LE(457) & 0xFB) >> 3,
            control: payload.readUInt32LE(455) & 0x03
          },
          register2: {
            data: payload.readUInt32LE(461),
            control: payload.readUInt32LE(461) & 0x03
          },
          register3: {
            data: payload.readUInt32LE(465),
            control: payload.readUInt32LE(465) & 0x03
          },
          register4: {
            enabled: payload.readUInt32LE(469) >> 5,
            control: payload.readUInt16LE(467) & 0x03
          },
          register5: {
            data: payload.readUInt32LE(472),
            control: payload.readUInt32LE(472) & 0x03
          }
        },
        frequencySkips: payload.readUInt16LE(476),
        broadSweepSteps: payload.readUInt16LE(478)
      },
      deviceData: {
        system: {
          operationalMode: payload.readUInt8(480),
          measurementFlag: payload.readUInt8(481),
          systemTickCount: payload.readUInt32LE(496),
          sdCardBlockIndex: payload.readUInt32LE(500)
        },
        connectionStatus: {
          lastPingTick: payload.readUInt32LE(484),
          hasConnection: payload.readUInt8(488)
        },
        deviceSettings: {
          averageOptical: payload.readUInt16LE(490),
          averageFPGA: payload.readUInt16LE(492),
          analogToDigitalConverter: payload.readUInt8(504),
          acceleroGyro: payload.buffer.slice(505, 508),
          magneto: payload.buffer.slice(508, 511),
          devicesInitialized: {
            sdCard: (payload.readUInt8(510) & 0x80) >> 7,
            magnetometer: (payload.readUInt8(510) & 0x40) >> 6,
            accelerometer: (payload.readUInt8(510) & 0x20) >> 5,
            gyroscope: (payload.readUInt8(510) & 0x10) >> 4,
            analogToDigitalConverter: (payload.readUInt8(510) & 0x08) >> 3,
            laser: (payload.readUInt8(510) & 0x04) >> 2,
            microwave: (payload.readUInt8(510) & 0x02) >> 1,
            attenuator: (payload.readUInt8(510) & 0x01) >> 0
          }
        }
      }
    }
  }

  return destructured
}
