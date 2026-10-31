<?php

namespace App\Http\Controllers;

use Inertia\Response;

class ProductController extends Controller
{
    //

    public function index(): Response
    {
        return inertia('products/Index');
    }
}
