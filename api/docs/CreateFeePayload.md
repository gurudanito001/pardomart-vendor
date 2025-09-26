# CreateFeePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | [**FeeType**](FeeType.md) |  | [default to undefined]
**amount** | **number** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**method** | [**FeeCalculationMethod**](FeeCalculationMethod.md) |  | [default to undefined]
**unit** | **string** |  | [optional] [default to undefined]
**minThreshold** | **number** |  | [optional] [default to undefined]
**maxThreshold** | **number** |  | [optional] [default to undefined]
**thresholdAppliesTo** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateFeePayload } from './api';

const instance: CreateFeePayload = {
    type,
    amount,
    description,
    isActive,
    method,
    unit,
    minThreshold,
    maxThreshold,
    thresholdAppliesTo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
