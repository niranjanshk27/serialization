import { BufferSerializer } from '../src/serializers/BufferSerializer';

const primitives = [
  ['int8', 255, 'readInt8', 'writeInt8'],
  ['int16', 65535, 'readInt16BE', 'writeInt16BE'],
  ['int32', 4294967295, 'readInt32BE', 'writeInt32BE'],
  ['uint8', 127, 'readUInt8', 'writeUInt8'],
  ['uint16', 32767, 'readUInt16BE', 'writeUInt16BE'],
  ['uint32', 2147483647, 'readUInt32BE', 'writeUInt32BE'],
  ['float', 10.327, 'readFloatBE', 'writeFloatBE'],
  ['double', 4244.546, 'readDoubleBE', 'writeDoubleBE'],
];

describe('Check BufferSerializer', () => {
  it('check for all primitives in read mode', () => {
    const writer = new BufferSerializer(1, 1000);

    writer.uint16(34);
    writer.uint8(12);
    writer.string('Hello World');
    writer.string('देवनागरी');
    const reader = new BufferSerializer(1, writer.getBuffer());
    expect(reader.uint16(0)).toBe(34);
    expect(reader.uint8(0)).toBe(12);
    expect(reader.string(null)).toBe('Hello World');
    expect(reader.string(null)).toBe('देवनागरी');
  });

  it('check for all failure conditions', () => {
    const writer = new BufferSerializer(1, 20);
    writer.uint32(5);
    writer.double(10);
    expect(() => writer.string("Long One Needs To Cross the 20 bytes limit")).toThrowError();

    const reader = new BufferSerializer(1, writer.getBuffer());
    console.log('Writer buffer', writer.getBuffer().length);
    expect(reader.uint32(0)).toBe(5);
    expect(reader.double(0)).toBe(10);
    expect(() => reader.string(null)).toThrowError();
  });

  it('check for all primitives in write mode', () => {
    // const src = 1;
    // const serializer = new BufferSerializer(1, src);

    // expect(serializer.getBuffer()).toEqual(Buffer.allocUnsafe(src));
    // expect(serializer.isLoading).toBeFalsy();
  });
});
