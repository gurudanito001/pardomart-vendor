# WalletTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**walletId** | **string** |  | [optional] [default to undefined]
**amount** | **number** | Positive for credit, negative for debit. | [optional] [default to undefined]
**type** | [**TransactionType**](TransactionType.md) |  | [optional] [default to undefined]
**status** | [**TransactionStatus**](TransactionStatus.md) |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**meta** | **object** | Extra metadata, like an order ID. | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { WalletTransaction } from './api';

const instance: WalletTransaction = {
    id,
    walletId,
    amount,
    type,
    status,
    description,
    meta,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
