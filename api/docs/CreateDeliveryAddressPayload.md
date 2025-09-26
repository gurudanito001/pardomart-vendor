# CreateDeliveryAddressPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**addressLine1** | **string** |  | [default to undefined]
**addressLine2** | **string** |  | [optional] [default to undefined]
**city** | **string** |  | [default to undefined]
**state** | **string** |  | [optional] [default to undefined]
**postalCode** | **string** |  | [optional] [default to undefined]
**country** | **string** |  | [default to undefined]
**isDefault** | **boolean** | If true, this will become the user\&#39;s new default address. | [optional] [default to undefined]
**latitude** | **number** |  | [optional] [default to undefined]
**longitude** | **number** |  | [optional] [default to undefined]
**label** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateDeliveryAddressPayload } from './api';

const instance: CreateDeliveryAddressPayload = {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
    latitude,
    longitude,
    label,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
