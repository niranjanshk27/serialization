import { JSONSerializer } from '../src/serializers/JSONSerializer';

const primitiveMethods = [
  'uint8',
  'uint16',
  'uint32',
  'int8',
  'int16',
  'int32',
  'float',
  'double',
  'string',
  'bool'
];

const primitiveValues = [255, 65535, 4294967295, 127, 32767, 2147483647, 10.327, 4244.546, '12', false];

describe('Check JSONSerializer', () => {
  it('check for version', () => {
    const serializer = new JSONSerializer(1);
    expect(serializer.version).toBe(1);
  });

  it('check for all primitives when src is provided', () => {
    const src = [1, '2', true, null, { a: 1 }, [1, 2]];
    const serializer = new JSONSerializer(1, src);

    primitiveValues.forEach((v, idx) => {
      const method = primitiveMethods[idx];
      // @ts-ignore
      expect(serializer[method](v)).toBe(v);
    });

    expect(serializer.toJSON()).toEqual([...src, ...primitiveValues]);
  });

  it('check for all primitives when src is not provided', () => {
    const serializer = new JSONSerializer(1);

    primitiveValues.forEach((v, idx) => {
      const method = primitiveMethods[idx];
      // @ts-ignore
      expect(serializer[method](v)).toBe(v);
    });
  
    expect(serializer.toJSON()).toEqual(primitiveValues);
  });

  it('check for all primitives when a blank array is provided', () => {
    const serializer = new JSONSerializer(1, []);

    primitiveValues.forEach((v, idx) => {
      const method = primitiveMethods[idx];
      // @ts-ignore
      expect(serializer[method](v)).toBe(v);
    });
  
    expect(serializer.toJSON()).toEqual(primitiveValues);
  });
});
