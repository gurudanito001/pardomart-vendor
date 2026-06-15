# CreateVendorPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**tagline** | **string** |  | [optional] [default to undefined]
**details** | **string** |  | [optional] [default to undefined]
**image** | **string** |  | [optional] [default to undefined]
**address** | **string** |  | [optional] [default to undefined]
**longitude** | **number** |  | [default to undefined]
**latitude** | **number** |  | [default to undefined]
**meta** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**timezone** | **string** |  | [optional] [default to undefined]
**mobileNumber** | **string** |  | [optional] [default to undefined]
**mobileVerified** | **boolean** |  | [optional] [default to false]
**availableForShopping** | **boolean** |  | [optional] [default to true]
**openingHours** | [**Array&lt;UpdateOpeningHoursPayload&gt;**](UpdateOpeningHoursPayload.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateVendorPayload } from './api';

const instance: CreateVendorPayload = {
    name,
    email,
    tagline,
    details,
    image,
    address,
    longitude,
    latitude,
    meta,
    timezone,
    mobileNumber,
    mobileVerified,
    availableForShopping,
    openingHours,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
