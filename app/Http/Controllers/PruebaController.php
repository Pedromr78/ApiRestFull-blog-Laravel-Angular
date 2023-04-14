<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Archive;


class PruebaController extends Controller
{
    

    public function prueba(){
        $archives= Archive::all();
        foreach($archives as $archive){
            echo $archive->name;
            echo '<br>';
            echo  $archive->categories->name;
        }
        die();
    }



}
