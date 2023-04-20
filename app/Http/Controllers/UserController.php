<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\JwtAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Response;

class UserController extends Controller
{
  public function register(Request $request){
    //recoger los datos
    $json= $request->input('json', null);//el null es por si mandan algo sin nada
    $params= json_decode($json);//pasa a objeto
    $params_array= json_decode($json,true);//pasa a array


    if(!empty($params) && !empty($params_array)){

    //limpiar datos por espacios etc..
    $params_array = array_map('trim',$params_array);
    //Validar datos
    $validate =   Validator::make($params_array, [
        'name'      => 'required|alpha',
        'email'     => 'required|email|unique:users',
        'surname'   => 'required|alpha',
        'password'  => 'required'
    ]);

    if($validate->fails()){
        $data= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'El usuario no se ha creado o ya existe un usuario con ese correo',
            'errors' => $validate->errors()
        );

        }else{
            //encriptado de la contraseña se encripta 4 veces
           // $pwd=password_hash($params->password,PASSWORD_BCRYPT, ['cost' => 4]);
            $pwd=hash('sha256',$params->password);

            try{
            
                //crea un objeto de la clase modelo y enlaza parametros con los valores del modelo
            $user= new User();

            $user->name=$params_array['name'];
            $user->email=$params_array['email'];
            $user->surname=$params_array['surname'];
            $user->password = $pwd;

           //guarda el objeto a la base de datos;
            $user->save();

            //Muestra el error 
            } catch(\Exception $e){
                
                echo $e->getMessage();   // insert query
             }

            $data= array(
               'status' => 'succes',
                'code'  => '200',
               'message'   =>'El usuario se ha registrado correctamente',
               'user'    => $user
            );
        
    }
    }else{
        $data= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'Faltan datos'
        );
    }



    
    return response()->json($data);
  }




  public function login(Request $request){
    //clase que autentificara el usuario
  
    $jwtAuth =new JWTAuth();
  
    //Recifir datos por post
    $json = $request->input('json', null);//el null es por si mandan algo sin nada
    $params= json_decode($json);//pasa a objeto
    $params_array= json_decode($json,true);//pasa a array


    $params_array = array_map('trim',$params_array);

    $validate =   Validator::make($params_array, [
        'password'  => 'required',
        'email'     => 'required|email',
    ]);

    if($validate->fails()){
        $signup= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'El usuario no se no se ha autentificado correctamente',
            'errors' => $validate->errors()
        );

        }else{

            $pwd=hash('sha256',$params->password);

           $signup = $jwtAuth->signup($params->email,$pwd);
  

            if(!empty($params->gettoken)){
                $signup = $jwtAuth->signup($params->email,$pwd, true);
            }
  
        }
        
        
    return response()->json($signup, 200);
  }

  public function update(Request $request){
    //Comprobar el usuario esta identificado
    $token= $request->header('Authorization');
    $jwtAuth = new JwtAuth();
    $checkToken = $jwtAuth->checkToken($token);


   //Recoger datos por post
   $json = $request->input('json',null);
   $params_array= json_decode($json,true);//pasa a array


    if($checkToken && !empty($params_array)){
  
    //Sacar usuario identificado
    $user= $jwtAuth->checkToken($token,true);

    //validar datos
    $validate =   Validator::make($params_array, [
        'name'      => 'required|alpha',
        'email'     => 'required|email|unique:users,'.$user->sub,
        'surname'   => 'required|alpha'
    ]);
    //Quitar campos que no quiero actualizar 
    unset($params_array['id']);
    unset($params_array['password']);
    unset($params_array['created_at']);
    unset($params_array['remember_token']);

    //actualizar usuario en bbdd
    $user_update =User::where('id', $user->sub)->update($params_array);
    //Devolver informacion
    $data= array(
        'status' => 'success',
        'code'  => '200',
        'usuario'   => $user,
        'changes'   =>$params_array
    );
    }else{
        $data= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'El usuario no se ha identificado',
        );
    }
    return response()->json($data);
  }


  public function upload(Request $request){
    //recoger datos
    $image= $request->file('file0');
    //validacion de la imagen
    $validate= Validator::make($request->all(), [
        'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
    ]);

    //Guardar la imagen
    if(!$image || $validate->fails()){

        $data= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'Error al subir la imagen',
        );

     
    }else{
        $image_name = time().$image->getClientOriginalName();//te saca el nombre completo, ilcuso el tipo de archivo y el time es el tiempo que se le concatena
        Storage::disk('users')->put($image_name, File::get($image));//guarda en la carpeta users 

        $data= array(
            'image' => $image_name,
            'code'  => '200',
            'stattus'   =>'Success',
        );
    }

   
    return response()->json($data, $data['code']);
  }
  public function getImage($filename){
    $isset = Storage::disk('users')->exists($filename);

    if($isset){
    $file = Storage::disk('users')->get($filename);
    return new Response($file, 200);
    }
    else{
        $data= array(
            'status' => 'error',
            'code'  => '404',
            'message'   =>'La imagen no existe',
        );
        return response()->json($data, $data['code']);
    }
  }


  public function detail($id){
    $user = user::find($id);

    if(is_object($user)){
        $data = array(
            'code' => "200",
            'status' => 'success',
            'user' => $user
        );
    }else{
        
        $data = array(
            'code' => "404",
            'status' => 'error',
            'message' => 'El usuario no existe'
        );

    }
    return response()->json($data, $data['code']);
  }

}
