import { JSONSerializer } from '../src/serializers/JSONSerializer';

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

    expect(serializer.isLoading).toBeFalsy();

    primitives.forEach(([method, value]) => {
      // @ts-ignore
      expect(serializer[method](value)).toBe(value);
    });

    expect(serializer.toJSON()).toEqual(src);
  });

  it('check for all primitives in write mode', () => {
    const serializer = new JSONSerializer(1);
    expect(serializer.isLoading).toBeTruthy();
  });

  it('should throw error when provided with empty payload', () => {
    expect(() => new JSONSerializer(1, [])).toThrow(Error);
  });
});
