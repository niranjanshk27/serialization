import { Serializer } from './Serializer';

/**
 * Helper method to serilize an array of item
 * @param serializeItem The function that can serialize the given item type of array
 * @param serializer The serializer
 * @param k The array to serialize
 */
export function serializeArray<T>(serializeItem: (k: T) => T, serializer: Serializer, k: T[]) {
  k.length = serializer.int16(k.length);
  for (let i = 0; i < k.length; i += 1) {
    k[i] = serializeItem(k[i]);
  }
  return k;
}
