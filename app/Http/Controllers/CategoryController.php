<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;



class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('api.auth')->except(['index', 'show']);
    }
    public function index(){
        $categories = Category::all();


        return response()->json([
            'code'      =>200,
            'status'    =>'succes',
            'categories' =>$categories
        ]);
    }
    public function show($id){
        $category = Category::find($id);

        if(is_object($category)){
        $data = [
                'code'      =>200,
                'status'    =>'succes',
                'category' =>$category
            ];
        }else{
            $data = [
                'code'      =>400,
                'status'    =>'error',
                'message' => 'La categoria no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }



    public function store(Request $request){
        //Recoger datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        if(!empty($params_array)){
        //Vaalidar los datos
        $validate =   Validator::make($params_array, [
            'name'      => 'required'
        ]);

        if($validate->fails()){
            $data = [
                'status' => 'error',
                'code'  => '404',
                'message'   =>'No se a guardado la cetegoria',
                'errors' => $validate->errors()
            ];
    
            }else{
                //Guardamos en la base de datos
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();
                $data = [
                    'code'      =>200,
                    'status'    =>'succes',
                    'category' =>$category
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




    public function update ($id, Request $request){
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        if(!empty($params_array)){
        //Vaalidar los datos
        $validate =   Validator::make($params_array, [
            'name'      => 'required'
        ]);
        unset($params_array['id']);
        unset($params_array['created_at']);
        if($validate->fails()){

            $data = [
                'status' => 'error',
                'code'  => '404',
                'message'   =>'No se a guardado la cetegoria',
                'errors' => $validate->errors()
            ];

        }else{
        $category = Category::where('id', $id)->updateOrCreate($params_array);
        $data = [
            'code'      =>200,
            'status'    =>'succes',
            'changes' =>$params_array
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

}
