<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('restaurant_table_id')
                ->constrained('restaurant_tables')
                ->restrictOnDelete();

            $table->date('reservation_date');

            $table->time('start_time');

            $table->time('end_time');

            $table->unsignedSmallInteger('guest_count');

            $table->string('status')
                ->default('pending');

            $table->text('special_request')
                ->nullable();

            $table->timestamps();

            $table->index([
                'restaurant_table_id',
                'reservation_date',
            ]);

            $table->index([
                'user_id',
                'reservation_date',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};