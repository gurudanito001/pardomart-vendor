# UpdateFeePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to undefined]
**method** | [**FeeCalculationMethod**](FeeCalculationMethod.md) |  | [optional] [default to undefined]
**unit** | **string** |  | [optional] [default to undefined]
**minThreshold** | **number** |  | [optional] [default to undefined]
**maxThreshold** | **number** |  | [optional] [default to undefined]
**thresholdAppliesTo** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateFeePayload } from './api';

const instance: UpdateFeePayload = {
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
