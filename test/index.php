<html>
    <head>
        <link rel="stylesheet" type="text/css" href="components/bootstrap3/css/bootstrap.min.css"> 
  <link rel="stylesheet" type="text/css" href="components/css/style.css">
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="components/bootstrap3/js/bootstrap.min.js"></script>
    </head>
    <body>
      <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Project name</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <table class="table table-condensed table-striped">
                    <thead>
                        <tr>
                            <th>StandAlone</th>
                            <th>Test Name </th>
                            <th>Result</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        <?php 
                            $tests = glob('specs/*Test.js');
                            foreach($tests as $test):
                        ?>
                    <tr>
                        <td class="col-md-2"><a href="standalone.php?specs=<?php echo $test;?>" target="_blank">[Run standalone]</a></td>
                        <td><?php echo $test;?></td>
                        <td class="col-md-2">Result</td>
                    </tr>
                    <?php endForeach;?>
                    </tbody>
                </table>
            </div>
        </div>
      

    
    </body>
</html>
<?php

?>