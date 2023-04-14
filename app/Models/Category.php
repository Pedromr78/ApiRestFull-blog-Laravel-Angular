<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Category extends Model
{    
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'updated_at'
    ];


    protected $table = 'categories';
   
    public function archives(){
     return $this->hasMany('App\Models\Archive');
 
    }


  

}
