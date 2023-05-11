<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/pepito', function () {
    return view('welcome');
});
Route::get('login', function () {
    return view('welcome');
});

//Get Conseguir datos o recursos
//Post Guardar datos o recursos o logica de un formulario
//Put Actuelizar datos  o recursos
//Delete Eliminar datos o recursos

// Route::get('/prueba', [PruebaController::class, 'prueba']);
//Rutas de los usuarios
Route::post('/api/register', [UserController::class, 'register']);

Route::post('/api/login', [UserController::class, 'login']);

Route::put('/api/update', [UserController::class, 'update']);

Route::post('/api/upload' ,[UserController::class, 'upload'])->middleware(\App\Http\Middleware\ApiAuthMiddleware::class);

Route::get('/api/avatar/{filename}', [UserController::class, 'getImage']);

Route::get('/api/detail/{id}', [UserController::class, 'detail']);


//Rutas de categorias

Route::resource('/api/category', CategoryController::class);



//Rutas de Posts

Route::resource('/api/posts', PostController::class);

Route::post('/api/post/upload' ,[PostController::class, 'upload']);

Route::get('/api/post/image/{filename}', [PostController::class, 'getImage']);

Route::get('/api/post/category/{id}', [PostController::class, 'getPostsByCategory']);

Route::get('/api/post/user/{id}', [PostController::class, 'getPostsByUser']);