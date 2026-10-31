<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('fulfillment_type', 20)
                ->nullable()
                ->index();

            $table->string('street_address')->nullable();

            $table->string('city')->nullable();

            $table->string('postal_code', 20)->nullable();

            $table->text('delivery_notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['fulfillment_type']);

            $table->dropColumn([
                'fulfillment_type',
                'street_address',
                'city',
                'postal_code',
                'delivery_notes',
            ]);
        });
    }
};
