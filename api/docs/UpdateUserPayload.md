# UpdateUserPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**mobileNumber** | **string** |  | [optional] [default to undefined]
**role** | [**Role**](Role.md) |  | [optional] [default to undefined]
**mobileVerified** | **boolean** |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to undefined]
**language** | **string** |  | [optional] [default to undefined]
**notification** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**referralCode** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserPayload } from './api';

const instance: UpdateUserPayload = {
    name,
    email,
    mobileNumber,
    role,
    mobileVerified,
    active,
    language,
    notification,
    referralCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
