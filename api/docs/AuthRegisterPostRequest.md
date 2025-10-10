# AuthRegisterPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The user\&#39;s full name. | [default to undefined]
**email** | **string** | The user\&#39;s email address. | [default to undefined]
**mobileNumber** | **string** | The user\&#39;s mobile number in E.164 format. | [default to undefined]
**role** | **string** | The role for the new user. | [default to undefined]
**vendorId** | **string** | Required if role is \&#39;store_shopper\&#39;. The ID of the vendor this staff member belongs to. | [optional] [default to undefined]

## Example

```typescript
import { AuthRegisterPostRequest } from './api';

const instance: AuthRegisterPostRequest = {
    name,
    email,
    mobileNumber,
    role,
    vendorId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
