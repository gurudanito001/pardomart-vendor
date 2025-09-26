# PardoMart API Client Generation Script
# This script generates a TypeScript Axios client from the OpenAPI specification

Write-Host "Generating PardoMart API Client..." -ForegroundColor Green

$API_SPEC_URL = "https://pardomart-node-api-vaje.onrender.com/api-docs/openapi.json"
$OUTPUT_DIR = "./api"

# Clean only generated files, preserve custom configuration
Write-Host "Cleaning generated API files (preserving config.ts)..." -ForegroundColor Yellow

$GENERATED_FILES = @(
    "$OUTPUT_DIR/api.ts",
    "$OUTPUT_DIR/base.ts", 
    "$OUTPUT_DIR/common.ts",
    "$OUTPUT_DIR/configuration.ts",
    "$OUTPUT_DIR/index.ts",
    "$OUTPUT_DIR/endpoints",
    "$OUTPUT_DIR/models",
    "$OUTPUT_DIR/docs",
    "$OUTPUT_DIR/git_push.sh",
    "$OUTPUT_DIR/.gitignore",
    "$OUTPUT_DIR/.npmignore",
    "$OUTPUT_DIR/.openapi-generator-ignore",
    "$OUTPUT_DIR/.openapi-generator"
)

foreach ($file in $GENERATED_FILES) {
    if (Test-Path $file) {
        Write-Host "  Removing: $file" -ForegroundColor Gray
        Remove-Item -Recurse -Force $file
    }
}

# Generate the API client
Write-Host "Downloading OpenAPI spec from: $API_SPEC_URL" -ForegroundColor Cyan
Write-Host "Generating TypeScript Axios client to: $OUTPUT_DIR" -ForegroundColor Cyan

npx @openapitools/openapi-generator-cli generate `
  -i $API_SPEC_URL `
  -g typescript-axios `
  -o $OUTPUT_DIR `
  --skip-validate-spec `
  --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,prependFormOrBodyParameters=true,legacyDiscriminatorBehavior=false,apiPackage=endpoints,modelPackage=models

if ($LASTEXITCODE -eq 0) {
    Write-Host "API client generated successfully!" -ForegroundColor Green
    Write-Host "Generated files are located in: $OUTPUT_DIR" -ForegroundColor Green
    Write-Host ""
    Write-Host "Custom configuration preserved:" -ForegroundColor Cyan
    Write-Host "   - config.ts (API configuration & token management)" -ForegroundColor White
    Write-Host ""
    Write-Host "You can import APIs from 'api/endpoints' (e.g., AuthApi, ProductApi)" -ForegroundColor Cyan
    Write-Host "You can import types from 'api/models' (e.g., User, Product)" -ForegroundColor Cyan
} else {
    Write-Host "API client generation failed!" -ForegroundColor Red
    exit 1
}
