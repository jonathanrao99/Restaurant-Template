$webhookPayload = @{
    type = "payment.updated"
    data = @{
        object = @{
            payment = @{
                id = "test-payment-$(Get-Date -Format 'yyyyMMddHHmmss')"
                status = "COMPLETED"
                reference_id = "62"
                amount_money = @{
                    amount = 2851
                    currency = "USD"
                }
            }
        }
    }
}

$jsonPayload = $webhookPayload | ConvertTo-Json -Depth 10

Write-Host "🔄 Testing Square webhook for order 62..." -ForegroundColor Yellow
Write-Host "📋 Payload:" -ForegroundColor Cyan
Write-Host $jsonPayload

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/webhooks/square" -Method POST -ContentType "application/json" -Body $jsonPayload
    
    Write-Host "✅ Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📄 Response Body: $($response.Content)" -ForegroundColor Green
    
    if ($response.StatusCode -eq 200) {
        Write-Host "🎉 Webhook test successful!" -ForegroundColor Green
        Write-Host "📋 Next steps:" -ForegroundColor Yellow
        Write-Host "1. Check Supabase orders table - order 62 should have payment_id and status='confirmed'" -ForegroundColor White
        Write-Host "2. If delivery order, external_delivery_id should be populated" -ForegroundColor White
        Write-Host "3. DoorDash delivery should be created" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error testing webhook: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure Next.js server is running: npm run dev" -ForegroundColor Yellow
} 