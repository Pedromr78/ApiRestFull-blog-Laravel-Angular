<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'updated_at',
        'content',
        'image'
    ];

    public $timestamps = false;

    protected $table = 'posts';

    public function categories(){
     return $this->belongsTo('App\Models\Category','category_id');
    }
    public function users(){
     return $this->belongsTo('App\Models\User','user_id');
    }
}
