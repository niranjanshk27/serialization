export interface Serializer {
  /**
   * Serialize 8 bit signed number -128 to 127
   * @param k The number to write, ignored while reading
   */
  int8(k: number): number;

  /**
   * Serialize 16 bit signed number -32768 to 32767
   * @param k The number to write, ignored while reading
   */
  int16(k: number): number;

  /**
   * Serialize 32 bit signed number -2147483648 to 2147483647
   * @param k The number to write, ignored while reading
   */
  int32(k: number): number;

  /**
   * Serialize 8 bit unsigned number 0 to 255
   * @param k The number to write, ignored while reading
   */
  uint8(k: number): number;

  /**
   * Serialize 16 bit unsigned number 0 to 65535
   * @param k The number to write, ignored while reading
   */
  uint16(k: number): number;

  /**
   * Serialize 32 bit unsigned number 0 to 4294967295
   * @param k The number to write, ignored while reading
   */
  uint32(k: number): number;

  /**
   * Serialize floating point number in 32 bit format
   * @param k The number to write, ignored while reading
   */
  float(k: number): number;

  /**
   * Serialize floating point number in 64 bit format
   * @param k The number to write, ignored while reading
   */
  double(k: number): number;

  /**
   * Serialize boolean value
   * @param k The boolean to write, ignored while reading
   */
  bool(k: boolean): boolean;

  /**
   * Serialize string
   * @param k The string to write, ignored while reading
   */
  string(k: string): string;


  /**
   * Flag set when the serializer is in read mode
   */
  readonly isLoading: boolean;

  /**
   * The version number for the serializer
   */
  readonly version: number;
}
