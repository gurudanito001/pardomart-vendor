# Fee


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**type** | [**FeeType**](FeeType.md) |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**method** | [**FeeCalculationMethod**](FeeCalculationMethod.md) |  | [optional] [default to undefined]
**unit** | **string** | e.g., \&#39;km\&#39; for per_distance | [optional] [default to undefined]
**minThreshold** | **number** |  | [optional] [default to undefined]
**maxThreshold** | **number** |  | [optional] [default to undefined]
**thresholdAppliesTo** | **string** | e.g., \&#39;order_subtotal\&#39; | [optional] [default to undefined]

## Example

```typescript
import { Fee } from './api';

const instance: Fee = {
    id,
    type,
    amount,
    description,
    isActive,
    createdAt,
    updatedAt,
    method,
    unit,
    minThreshold,
    maxThreshold,
    thresholdAppliesTo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
