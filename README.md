# Data Serialization
Data serialization library for communication and storage purpose with versioning.

The library is focused on solving two specific issues:
1. **The application version mismatch**\
   Data serialization is a complicated task, specially when you are maintaining a
    project for a long time. With addition of a new feature, it becomes complicated
    to keep your data readable between two versions of your same software.
    *. You have saved your data using older version of your software, which would pose
       an issue when loading with a newer version of your software.
    *. You have a client server application, where the server has been updated to a
       newer version, but there still exists client that hasn't updated for a long
       time. In rare case scenario (like our hotspot games), the server could be an
       older version whereas the client might have been a newer version.

2. **Loading class instances from serializable data**\
   While loading data either from storage or a communication channel, it is always
   extra work to map that data to particular instance. We try to solve that with
   two different approach:
   i. Make the classes `Serializable` and use `SerialiableFactory` for serialization,
      identification and creation of class instances.
   ii. For certain scalar objects (ex: ComplexNumber), treat them like a primary data
      type and create helper functions `serializeComplexNumber` to serialize these objects.
      ```javascript
      function serializeComplexNumber(serializer: Serializer, complexNumber: ComplexNumber) {
        if (serializer.isLoading) {
          const real = serializer.double(0);
          const imaginary = serializer.double(0);
          return new ComplexNumber(real, imaginary);
        } else {
          serializer.double(complexNumber.real);
          serializer.double(complexNumber.imaginary);
          return complexNumber;
        }
      }
      ```
**Side Goal**\
When it comes to serialization, most of the time, the error arises due to performing
data reading and writing with two different codes. We have tried to minimize that
by doing both reading and writing with the same code. For example, a typical object
serialization would look like:
```javascript
function serialize(serializer: Serializer) {
  this.name = serializer.string(this.name);
  this.dob = new Date(serializer.int32(this.dob.getTime() / 1000) * 1000);
  this.salary = serializer.double(this.salary);
}
```
In rare cases, if you need a different logic for reading and writing, the `isLoading`
flag on `Serializer` should be used.

## Installation
> `yarn add @bhoos/serialization`

## Primary serialization
Use the basic function from `Serializer` for primary data type serialization:
* `int8`
* `int16`
* `int32`
* `uint8`
* `uint16`
* `uint32`
* `float`
* `double`
* `string`

Properties available in `Serializer`
* `version` The version of the serializer typically based on the app.
* `isLoading` The mode of the serializer. Based on the mode, the
data is either read (`loading`) or written.

## Standard Usage
Implement the Serializable interface
```typescript
import { Serializable, Serializer } from '@bhoos/serialization'
class ComplexNumber implements Serializable {
  real: number;
  imaginary: number;

  // Implement the serialize function
  serialize(serializer: Serializer) {
    // Assuming we used floating size number in earlier version
    // and later upgraded to double size numbers
    if (serializer.version < 2 ) {
      serializer.float(this.real);
      serializer.float(this.imaginary);
    } else {
      serializer.double(this.real);
      serailizer.double(this.imaginary);
    }
  }

  // Optionally extend onCreate to initialize object
  // after serialization creates it
  onCreate() {

  }
}
```

## Application Usage
The standard JSON and Buffer based serializers are provided
with the library. If any other format are required, they
can be created by implementing the `Serializer` interface.
```typescript
class CommunicationChannel {
  private factory = new SerializableFactor();

  constructor(version: number) {
    this.version = version;
    this.factory.register(1, ComplexNumber);
  }

  sendObject(obj: Serializable) {
    // Initialize buffer serializer for writing
    const serializer = new BufferSerializer(this.version, 1000);
    this.factory.serialize(serializer, obj);
    this.channel.send(serializer.getBuffer());
  }

  receiveObject(buffer: Buffer) {
    const serializer = new BufferSerializer(this.version, buffer);
    const obj = this.factory.serialize(serializer, null);
    return obj;
  }
}
```

## Helper functions
* `serializeArray`: Serialize an array of specific types<br/>
  1. Ex: `serializeArray(serializer.string, serializer, source)`;
  2. Ex: `serializeArray(this.factory.bind(serializer), serializer, objArray)`


