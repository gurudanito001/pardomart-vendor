# UpdateOpeningHoursPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vendorId** | **string** | The ID of the vendor whose opening hours are being updated. | [default to undefined]
**day** | [**Days**](Days.md) |  | [default to undefined]
**open** | **string** | The opening time in 24-hour format (e.g., \&#39;09:00\&#39;). Set to null to mark as closed. | [optional] [default to undefined]
**close** | **string** | The closing time in 24-hour format (e.g., \&#39;18:00\&#39;). Set to null to mark as closed. | [optional] [default to undefined]

## Example

```typescript
import { UpdateOpeningHoursPayload } from './api';

const instance: UpdateOpeningHoursPayload = {
    vendorId,
    day,
    open,
    close,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
