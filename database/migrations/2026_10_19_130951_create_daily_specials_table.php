<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_specials', function (Blueprint $table) {
            $table->id();

            $table->foreignId('menu_item_id')
                ->constrained('menu_items')
                ->cascadeOnDelete();

            $table->date('special_date')->unique();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_specials');
    }
};
