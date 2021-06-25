import { BufferSerializer } from '../dist/serializers/BufferSerializer.js';
import { Oracle } from '../dist/Oracle.js';
import { Serializable } from '../dist/Serializable.js';
import { Serializer } from '../dist/Serializer.js';

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

const oracle = new Oracle();
class SampleObj implements Serializable {
  num: number;
  str: string;

  serialize(serializer: Serializer) {
    this.num = serializer.float(this.num);
    this.str = serializer.string(this.str);
  }

  static create(num: number, str: string) {
    const k = new SampleObj();
    k.num = num;
    k.str = str;
    return k;
  }
}
oracle.register(5, SampleObj, () => new SampleObj());

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
    expect(reader.uint32(0)).toBe(5);
    expect(reader.double(0)).toBe(10);
    expect(() => reader.string(null)).toThrowError();
  });

  it('check for array serialization', () => {
    const writer = new BufferSerializer(1, 110);
    const list = [
      SampleObj.create(1, 'One'),
      SampleObj.create(2, 'Two'),
      SampleObj.create(3, 'Three'),
      SampleObj.create(4, 'Four'),
      SampleObj.create(5, 'Five'),
      SampleObj.create(6, 'Six'),
      SampleObj.create(7, 'Seven'),
      SampleObj.create(8, 'Eight'),
    ];

    const k = writer.larray(list, 0, oracle.serialize);
    expect(k).toBe(7);
    expect(writer.getBuffer().byteLength).toBe(99);

    const reader = new BufferSerializer(1, writer.getBuffer());
    const res = [] as SampleObj[];
    const k2 = reader.larray(res, 0, oracle.serialize);
    expect(k2).toBe(7);
    expect(res.length).toBe(7);
  });

  it('check for all primitives in write mode', () => {
    // const src = 1;
    // const serializer = new BufferSerializer(1, src);

    // expect(serializer.getBuffer()).toEqual(Buffer.allocUnsafe(src));
    // expect(serializer.isLoading).toBeFalsy();
  });
});
