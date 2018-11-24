<?php
    
    include_once "lib.php";
    define('ROOT',$_SERVER['DOCUMENT_ROOT']);    
    $request_uri = $_SERVER['REQUEST_URI'];

    if( $request_uri == '/' || false !== strpos($request_uri,'index') || false !== strpos($request_uri,'main') ) {
        $page = './page/index.php';
    } else {
        $page = './page'.$request_uri.'.php';
    }
    
    include_once './layout/header.php';
    if( false !== is_file( $page ) ) {
        include_once $page;
    } else {
        include_once '/main.php';
    }
    include_once './layout/footer.php';
?>