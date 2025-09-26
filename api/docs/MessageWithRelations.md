# MessageWithRelations


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**senderId** | **string** |  | [optional] [default to undefined]
**recipientId** | **string** |  | [optional] [default to undefined]
**orderId** | **string** |  | [optional] [default to undefined]
**readAt** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**sender** | [**UserSummary**](UserSummary.md) |  | [optional] [default to undefined]
**recipient** | [**UserSummary**](UserSummary.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MessageWithRelations } from './api';

const instance: MessageWithRelations = {
    id,
    content,
    senderId,
    recipientId,
    orderId,
    readAt,
    createdAt,
    updatedAt,
    sender,
    recipient,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
