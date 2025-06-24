$webhookPayload = @{
    merchant_id = "ML6H8A63HAHYW"
    type = "payment.updated"
    event_id = "test-event-$(Get-Date -Format 'yyyyMMddHHmmss')"
    created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    data = @{
        type = "payment"
        id = "test-payment-$(Get-Date -Format 'yyyyMMddHHmmss')"
        object = @{
            payment = @{
                id = "test-payment-$(Get-Date -Format 'yyyyMMddHHmmss')"
                status = "COMPLETED"
                order_id = "test-square-order-id"
                amount_money = @{
                    amount = 2743
                    currency = "USD"
                }
                total_money = @{
                    amount = 2743
                    currency = "USD"
                }
                source_type = "EXTERNAL"
                location_id = "LEVM9XEX90AZ7"
                created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                updated_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                version = 1
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