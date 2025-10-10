# TransactionWithRelations


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**type** | [**TransactionType**](TransactionType.md) |  | [optional] [default to undefined]
**source** | [**TransactionSource**](TransactionSource.md) |  | [optional] [default to undefined]
**status** | [**TransactionStatus**](TransactionStatus.md) |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**orderId** | **string** |  | [optional] [default to undefined]
**externalId** | **string** | ID from the external payment provider (e.g., Stripe Payment Intent ID). | [optional] [default to undefined]
**meta** | **object** | Additional metadata, such as payment details from Stripe. | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**order** | [**TransactionWithRelationsAllOfOrder**](TransactionWithRelationsAllOfOrder.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TransactionWithRelations } from './api';

const instance: TransactionWithRelations = {
    id,
    userId,
    amount,
    type,
    source,
    status,
    description,
    orderId,
    externalId,
    meta,
    createdAt,
    updatedAt,
    order,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
