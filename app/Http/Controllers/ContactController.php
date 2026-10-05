<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request)
    {
        ContactMessage::create($request->validated());

        return back()->with(
            'success',
            'Your message has been sent successfully.'
        );
    }
}