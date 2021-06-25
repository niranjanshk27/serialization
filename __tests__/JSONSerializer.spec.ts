import { JSONSerializer } from '../dist/serializers/JSONSerializer.js';

const primitives = [
  ['uint8', 255],
  ['uint16', 65535],
  ['uint32', 4294967295],
  ['int8', 127],
  ['int16', 32767],
  ['int32', 2147483647],
  ['float', 10.327],
  ['double', 4244.546],
  ['string', '12'],
  ['bool', false],
]

describe('Check JSONSerializer', () => {
  it('check for version', () => {
    const serializer = new JSONSerializer(1);
    expect(serializer.version).toBe(1);
  });

  it('check for all primitives in read mode', () => {
    const src = [1, '2', true];
    const serializer = new JSONSerializer(1, src);

    expect(serializer.isLoading).toBeTruthy();

    expect(serializer.uint8(0)).toBe(src[0]);
    expect(serializer.string('')).toBe('2');
    expect(serializer.bool(false)).toBe(true);
  });

  it('check for all primitives in write mode', () => {
    const serializer = new JSONSerializer(1);
    expect(serializer.isLoading).toBeFalsy();
  });

  it('should throw error when provided with empty payload', () => {
    expect(() => new JSONSerializer(1, [])).toThrow(Error);
  });
});
