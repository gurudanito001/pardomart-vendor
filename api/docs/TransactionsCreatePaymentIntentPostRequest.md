# TransactionsCreatePaymentIntentPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **string** |  | [default to undefined]
**paymentType** | **string** | Optional. Specifies the type of payment. Use \&#39;ebt\&#39; to configure the intent for EBT processing, otherwise defaults to standard automatic payment methods. | [optional] [default to undefined]

## Example

```typescript
import { TransactionsCreatePaymentIntentPostRequest } from './api';

const instance: TransactionsCreatePaymentIntentPostRequest = {
    orderId,
    paymentType,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
