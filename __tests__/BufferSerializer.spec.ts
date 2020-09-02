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

describe.skip('Check BufferSerializer', () => {
  it('check for version', () => {
    const serializer = new BufferSerializer(1, 1);
    expect(serializer.version).toBe(1);
  });

  it('check for all primitives in read mode', () => {
    const buffer = Buffer.from("THIS IS SPARTA");
    const serializer = new BufferSerializer(1, buffer);

    expect(serializer.getBuffer()).toBe(buffer);
    expect(serializer.isLoading).toBeTruthy();

    primitives.forEach(([method, _, read]) => {
      // @ts-ignore
      const bufferRead = Buffer.prototype[read];
      // @ts-ignore
      expect(serializer[method](bufferRead)).toBe(buffer[read]());
    })

    expect(serializer.string('Hello World')).toBe(buffer.toString('utf-8'));
  });

  it('check for all primitives in write mode', () => {
    const src = 1;
    const serializer = new BufferSerializer(1, src);

    expect(serializer.getBuffer()).toEqual(Buffer.allocUnsafe(src));
    expect(serializer.isLoading).toBeFalsy();
  });
});
