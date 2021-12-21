interface Packet {
  version: number;
  type: string;
  length: number;
}

interface LiteralPacket extends Packet {
  type: "literal";
  value: number;
}

type OperatorLengthType =
  | { type: "0"; bitCount: number }
  | { type: "1"; subpacketCount: number };

interface OperatorPacket extends Packet {
  type: "operator";
  operatorType: number;
  lengthType: OperatorLengthType;
  subpackets: Array<OperatorPacket | LiteralPacket>;
}

export function packetDecoder(data: string) {
  const binary = hexToBinary(data);
  const packet = loadPacket(binary);

  const sum = sumVersions(packet);
  const value = packetValue(packet);

  console.log(`[2021, 16-01] Sum of all versions: ${sum}`);
  console.log(`[2021, 16-02] Complete packet value: ${value}`);
}

const packetValue = (packet: OperatorPacket | LiteralPacket): number => {
  if (packet.type == "literal") {
    return packet.value;
  }

  return getOperation(packet.operatorType)(packet.subpackets);
};

function getOperation(
  id: number
): (packets: Array<OperatorPacket | LiteralPacket>) => number {
  switch (id) {
    case 0:
      return sum;
    case 1:
      return product;
    case 2:
      return minimum;
    case 3:
      return maximum;
    case 5:
      return greaterThan;
    case 6:
      return lowerThan;
    case 7:
      return equals;
    default:
      throw new Error("Invalid type");
  }
}

const sum = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packets.reduce((p, c) => p + packetValue(c), 0);
};

const product = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packets.reduce((p, c) => p * packetValue(c), 1);
};

const minimum = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packets.reduce((p, c) => {
    const value = packetValue(c);
    return value < p ? value : p;
  }, Number.MAX_SAFE_INTEGER);
};

const maximum = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packets.reduce((p, c) => {
    const value = packetValue(c);
    return value > p ? value : p;
  }, 0);
};

const greaterThan = (
  packets: Array<OperatorPacket | LiteralPacket>
): number => {
  return packetValue(packets[0]) > packetValue(packets[1]!) ? 1 : 0;
};

const lowerThan = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packetValue(packets[0]) < packetValue(packets[1]!) ? 1 : 0;
};

const equals = (packets: Array<OperatorPacket | LiteralPacket>): number => {
  return packetValue(packets[0]) == packetValue(packets[1]!) ? 1 : 0;
};

const sumVersions = (packet: Packet): number => {
  if (packet.type == "operator") {
    const cast = packet as OperatorPacket;
    return (
      cast.version + cast.subpackets.reduce((p, c) => p + sumVersions(c), 0)
    );
  }

  return packet.version;
};

const hexToBinary = (hex: string): string => {
  return [...hex].reduce((p, c) => p + singleHexToBinary(c), "");
};

const singleHexToBinary = (hex: string): string => {
  return parseInt("F" + hex, 16)
    .toString(2)
    .substring(4);
};

const loadPacket = (binary: string): OperatorPacket | LiteralPacket => {
  const version = parseInt(binary.substring(0, 3), 2);
  const type = parseInt(binary.substring(3, 6), 2);

  if (type == 4) {
    const [payload, length] = parseLiteralPayload(binary.substring(6));
    return {
      type: "literal",
      version,
      length: length + 6,
      value: parseInt(payload, 2),
    };
  } else {
    const payload = parseOperatorPayload(binary.substring(6));
    return {
      type: "operator",
      operatorType: type,
      version,
      lengthType: payload[0],
      subpackets: payload[1],
      length:
        6 +
        payload[1].reduce((p, c) => p + c.length, 0) +
        (payload[0].type == "0" ? 16 : 12),
    };
  }
};

const parseLiteralPayload = (binary: string): [string, number] => {
  if (binary[0] == "0") {
    return [binary.substring(1, 5), 5];
  }

  const [followingPayload, remainingLength] = parseLiteralPayload(
    binary.substring(5)
  );
  return [binary.substring(1, 5) + followingPayload, 5 + remainingLength];
};

const parseOperatorPayload = (
  binary: string
): [OperatorLengthType, Array<OperatorPacket | LiteralPacket>] => {
  const operatorLength = readOperatorPacketLength(binary);
  const subpackets: Array<OperatorPacket | LiteralPacket> = [];

  if (operatorLength.type == "0") {
    let payload = binary.substring(16, 16 + operatorLength.bitCount);

    while (payload.length > 0) {
      const packet = loadPacket(payload);
      payload = payload.substring(packet.length);
      subpackets.push(packet);
    }
  } else {
    let payload = binary.substring(12);
    let packetRead = 0;

    while (packetRead < operatorLength.subpacketCount) {
      const packet = loadPacket(payload);
      ++packetRead;
      payload = payload.substring(packet.length);
      subpackets.push(packet);
    }
  }

  return [operatorLength, subpackets];
};

const readOperatorPacketLength = (binary: string): OperatorLengthType => {
  return binary[0] == "0"
    ? {
        type: "0",
        bitCount: parseInt(binary.substring(1, 16), 2),
      }
    : {
        type: "1",
        subpacketCount: parseInt(binary.substring(1, 12), 2),
      };
};
