<?php

namespace App;

enum RestaurantTableStatus:string
{
    //
    case Available = 'available';
    case Occupied = 'occupied';
    case Reserved = 'reserved';
    case Inactive = 'inactive';
}
