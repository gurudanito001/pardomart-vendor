# OrderOrderIdMessagesPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**recipientId** | **string** | The ID of the user who is the recipient of the message. | [default to undefined]
**content** | **string** | The text content of the message or base64 image string. | [default to undefined]
**type** | [**MessageType**](MessageType.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderOrderIdMessagesPostRequest } from './api';

const instance: OrderOrderIdMessagesPostRequest = {
    recipientId,
    content,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
