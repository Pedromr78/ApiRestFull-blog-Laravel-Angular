<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Posts;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use App\Helpers\JwtAuth;
use GuzzleHttp\Psr7\Response as Psr7Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;    

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('api.auth')->except(['getPostsByUser','getPostsByCategory','index', 'show','getImage']);
    }

    public function index(){
        $posts= Posts::all();


        return response()->json([
            'code'      =>200,
            'status'    =>'succes',
            'posts' =>$posts
        ], 200);

    }



    public function show($id){
        //load me saca los datos de la tabla categories y users
        $post= Posts::find($id)->load('categories')->load('users');

        if(is_object($post)){
            $data = [
                'code'      =>200,
                'status'    =>'succes',
                'post' =>$post
            ];
        }else{
            $data = [
                'code'      =>404,
                'status'    =>'error',
                'message'   =>'Este post no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function store(Request $request){
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        if(!empty($params_array)){
            $JwtAuth= new JWTAuth();
            $token= $request->header('Authorization', null);
            //te devuelve todos los datos del usuario decodificados
            $user= $JwtAuth->checkToken($token, true);
       

        $validate =   Validator::make($params_array, [
            'title'      => 'required',
            'content' => 'required',
            'category_id' => 'required',
            'image'     => 'image|mimes:jpg,png,jpeg,gif,svg'
        ]);
        if($validate->fails()){
            $data = [
                'status' => 'error',
                'code'  => '404',
                'message'   =>'No se a guardado el post, faltan datos',
                'errors' => $validate->errors()
            ];
    
            }else{
                $post = new Posts;
                $post->user_id=$user->sub;
                $post->category_id=$params->category_id;
                $post->title= $params->title;
                $post->content= $params->content;
                $post->image = $params->image;
                $post->save();
                $data = [
                    'code'      =>200,
                    'status'    =>'succes',
                    'post' =>$post
                ];
            }
        }else{
            $data = [
                'status' => 'error',
                'code'  => '404',
                'message'   =>'No has enviado ningun dato'
            ];
        }
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request){
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        if(!empty($params_array)){

           

            $validate =   Validator::make($params_array, [
                'title'      => 'required',
                'content' => 'required',
                'category_id' => 'required'
            ]);

            unset($params_array['id']);
            unset($params_array['user_id']);
            unset($params_array['created_at']);
            unset($params_array['user']);
            
            $JwtAuth= new JWTAuth();
            $token= $request->header('Authorization', null);
            //te devuelve todos los datos del usuario decodificados
            $user= $JwtAuth->checkToken($token, true);
            
            $postupdated = Posts::where('user_id', $user->sub)->where('id', $id)->update($params_array);

            $data = [
                'code'      =>200,
                'status'    =>'succes',
                'post'=>$postupdated,
                'changes' =>$params_array
            ];
        }else{
                $data = [
                    'status' => 'error',
                    'code'  => '404',
                    'message'   =>'No has enviado ningun dato'
                ];
            }
            return response()->json($data, $data['code']);
        
}


    public function destroy($id, Request $request){

        $JwtAuth= new JWTAuth();
        $token= $request->header('Authorization', null);
        //te devuelve todos los datos del usuario decodificados
        $user= $JwtAuth->checkToken($token, true);



        $post = Posts::where('id',$id)
                      ->where('user_id',$user->sub)
                      ->first();
        if(!empty($post)){
            $post->delete();

            $data = [
                'code'      =>200,
                'status'    =>'succes',
                'post' =>$post
            ];
          

        }else{
            $data = [
                'status' => 'error',
                'code'  => '404',
                'message'   =>'El post no existe'
            ];
    }
        return response()->json($data, $data['code']);
    }

    public function upload(Request $request){
        //recoger datos
        $image= $request->file('file0');
       
        $validate= Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);
    
        //Guardar la imagen
        if(!$image || $validate->fails()){
    
            $data= array(
                'status' => 'error',
                'code'  => 400,
                'message'   =>'Error al subir la imagen',
            );
    
         
        }else{
            $image_name = time().$image->getClientOriginalName();//te saca el nombre completo, ilcuso el tipo de archivo y el time es el tiempo que se le concatena
            Storage::disk('images')->put($image_name, File::get($image));//guarda en la carpeta users 
    
            $data= array(
                'image' => $image_name,
                'code'  => '200',
                'stattus'   =>'Success',
            );
        }
        return response()->json($data, $data['code']);
    }
    public function getImage($filename){
        $isset = Storage::disk('images')->exists($filename);
        if($isset){
            $file = Storage::disk('images')->get($filename);
            return new response($file,200);
        }
        else{
            $data= array(
                'status' => 'error',
                'code'  => 400,
                'message'   =>'La imagen no existe',
            );
        }
        return response()->json($data, $data['code']);
    }
    


    public function getPostsByCategory($id){
        $post = Posts::where('category_id', $id)->get();

        return response()->json ([
            'status'  => 'success',
            'posts'  => $post
        ],200);
    }
    public function getPostsByUser($id){
        $post = Posts::where('user_id', $id)->get();

        return response()->json ([
            'status'  => 'success',
            'posts'  => $post
        ],200);
    }

}
