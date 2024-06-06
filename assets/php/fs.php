<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        if($data) {
            $currentFile = fopen('../json/fs.json', 'r');
            $currentContent = fread($currentFile, filesize('../json/fs.json'));
            fclose($currentFile);

            $oldFile = fopen('../json/fs_old.json', 'w');
            fwrite($oldFile, $currentContent);
            fclose($oldFile);

            $newContent = json_encode($data['newFile']);
            $currentFile = fopen('../json/fs.json', 'w');
            fwrite($currentFile, $newContent);
            fclose($currentFile);
        }
    }
?>