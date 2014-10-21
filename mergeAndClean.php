<?php

class mergeAndClean {

    protected $content;

    public function run($path, $skip) {
        $files = glob($path);
        if (empty($files)) {
            die('No files Selected!');
        }
        
            $this->content = $this->getContents($files,$skip);
        
    }

    protected function getContents($files,$skip) {
        $content = '';
        foreach ($files as $file) {
            if(!in_array($file, $skip)){
            $content .= file_get_contents($file);
            }
        }
        return $content;
    }

    public function clean($regexArray) {
        foreach ($regexArray as $regex) {
            $this->content = preg_replace($regex, '', $this->content);
        }
    }

    public function save($path) {
        $fp = fopen($path, 'w+');
        fputs($fp, $this->content);
        fclose($fp);
    }

}
$skip = [];
echo "Do you want to skip the BootstrapExtendedVersion?(yes,no) ";
$handle = fopen("php://stdin", "r");
$line = fgets($handle);
if (trim($line) == 'yes') {
    $skip[] = 'src/03_AiwBootstrapParams.js';
}

$mergeAndClean = new mergeAndClean();

$mergeAndClean->run('src/*.js', $skip);

$mergeAndClean->clean([
    '!/\*.*?\*/!s', //Remove /**/ comments
//    '/\n\s*\n/',    // remove new line
    '(\/\/.*)', // remove single line comment
]);
$mergeAndClean->save("lib/aiwFormGenerator-".$argv[1].".js");
?>