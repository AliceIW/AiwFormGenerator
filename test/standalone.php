<?php 
if (empty($_GET['specs'])):
    die('No Specs Specified!');
endif;
?>
<html>
<head>
<link rel="shortcut icon" type="image/png" href="../vendor/pivotal/jasmine/lib/jasmine-core/jasmine_favicon.png">
<link rel="stylesheet" type="text/css" href="../vendor/pivotal/jasmine/lib/jasmine-core/jasmine.css"> 
<script type="text/javascript" src="helpers/jquery-1.11.1.js"></script>
<script type="text/javascript" src="../vendor/pivotal/jasmine/lib/jasmine-core/jasmine.js"></script>
<script type="text/javascript" src="../vendor/pivotal/jasmine/lib/jasmine-core/jasmine-html.js"></script>
<script type="text/javascript" src="../vendor/pivotal/jasmine/lib/jasmine-core/boot.js"></script>
<script type="text/javascript" src="helpers/jasmine-jquery.js"></script>
<script type="text/javascript" src="helpers/aiwHelper.js"></script>
<script>
    jasmine.getFixtures().fixturesPath = 'fixtures/';
</script>
<script type="text/javascript" src="../example/assets/angular/angular.js"></script>
<?php
    $configPath = substr($_GET['specs'],6,-3);
    $dependencies =include('config/'.$configPath.'Config.php');
    foreach($dependencies as $dependency):
    ?>
<script type="text/javascript" src="<?php echo $dependency;?>"></script>
<?php
    endforeach;
?>
<script type="text/javascript" src="<?php echo $_GET['specs'];?>"></script>
</head>
<body>

</body>
</html>


