var resources = {


 //Worker units:
 
 'Worker':[192,192,192],
 'Farmer':[192,192,192],
 'Lumberjack':[192,192,192],
 'Miner':[192,192,192],
 'Carpenter':[192,192,192],
 'Mason':[192,192,192],
 'child':[192,192,192],
 'Monk':[50,60,90],
 
 
 //Resources:

 'stone':[128,128,128],
 'log':[136,91,51],
 'grain':[248,239,187],
 'water':[46,115,174],
 
 'coal':[48,48,48],
 'dull ore':[133,75,57],
 
 'shiny ore':[144,209,255],
 'quartz':[144,209,255],
 'heavy ore':[108,108,200],
 
 'stick':[136,91,51],
 'reed':[248,239,187],
 'lotus':[40,50,80],
 
 
 //Types of Labor:
 
 'labor':[192,192,192],
 'labor (Hoe)':[192,192,192],
 'labor (Axe)':[192,192,192],
 'labor (Pick)':[192,192,192],
 'labor (Saw)':[192,192,192],
 'labor (Hammer)':[192,192,192],
 'labor (Wizened)':[192,192,192],
 'unequip':[192,192,192],
 
 
 //Locations:

 'Forest':[25,102,19],
 'Cavern':[80,80,80],
 'Steppe':[137,174,94],
 'Clearing':[137,174,94],
 'Stream':[46,115,174],
 'Field':[150,164,108],
 'Grain Field (planted)':[150,164,108],
 'Grain Field (ripe)':[248,239,187],
 
 
 //Buildings:
 
 'Town Hall':[192,192,192],
 
 'Anvil':[72,72,72],
 'Bakery':[248,239,187],
 'Hovel':[136,91,51],
 'Inn':[126,81,41],
 'Furnace':[128,128,128],
 'Watermill':[136,91,51],
 'Steelworks':[108,108,108],
 'Monastery':[120,140,120],
 
 'Mineshaft':[60,60,60],
 'Mineshaft (Deep)':[40,40,40],
 'Mineshaft (Collapsed)':[60,60,60],
 'Underground Spring':[46,115,174],
 
 'Well':[46,115,174],
 
 
 //Refined Resources:
 'iron':[72,72,72],
 'platinum':[144,209,255],
 'charcoal':[48,48,48],
 'steel':[128,128,128],
 'lead':[108,108,200],
 'glass':[124,189,255],

 'quartz dust':[144,209,255],
 
 'grain flour':[248,239,187],
 'dough':[248,239,187],
 'bread':[174,126,42],
 'paper':[182,182,182],
 'ink':[40,40,40],
 
 'plank':[136,91,51],
 'stone brick':[128,128,128],
 
 'fresh water':[46,115,174],
 
 
 //Tools:
 'Hoe':[72,72,72],
 'Axe':[72,72,72],
 'Pick':[72,72,72],
 'Saw':[72,72,72],
 'Hammer':[72,72,72]
};

var discardables = {
 'water':true,
 'labor':true,
 'labor (Hoe)':true,
 'labor (Axe)':true,
 'labor (Pick)':true,
 'labor (Saw)':true,
 'labor (Hammer)':true,
 'labor (Wizened)':true,
 'fresh water':true,
 'unequip':true
};

var blueprints = {
 'Steppe':[{inputs:{'labor':5}, outputs:[{'Clearing':1},{'grain':3},{'grain':3},{},{},{},{},{},{},{'Clearing':1},{'grain':3},{'grain':3},{},{},{},{},{},{},{'Stream':1}]}],
 'Forest':[{inputs:{'labor':5}, outputs:[{'log':1}, {'stick':2},{'log':1}]},
           {inputs:{'labor (Axe)':10}, outputs:{'log':8}}],
 'Stream':[{inputs:{}, outputs:{'water':3}},
         {inputs:{'labor (Axe)':2}, outputs:[{'stick':3},{'reed':5},{'reed':3},{'lotus':1},{},{},{}]}],
 'Cavern':[{inputs:{'labor':5}, outputs:[{'stone':2,'coal':1},{'stone':2,'dull ore':1},{'stone':3},{},{}]},
           {inputs:{'log':20,'labor (Pick)':70}, outputs:{'Mineshaft':1}}],
 'Mineshaft':[{inputs:{'labor (Pick)':10, 'log':10}, outputs:[{'stone':10,'coal':3,'dull ore':3},{'stone':10,'coal':1,'dull ore':1},{'stone':10},{'stone':10},{'stone':10, 'heavy ore':1},{'stone':10},{'stone':10},{'stone':10,'coal':3,'dull ore':3},{'stone':10,'coal':1,'dull ore':1},{'stone':10},{'stone':10}],
               residual:{'depth':2}},
              {inputs:{'depth':300}, outputs:{'UPGRADE':'Mineshaft (Deep)'}}],
 'Mineshaft (Deep)':[{inputs:{'labor (Pick)':10, 'log':10}, outputs:[{'stone':10},{'stone':10},{'stone':5,'shiny ore':1},{'stone':5,'shiny ore':1},{'stone':5,'shiny ore':1},{'stone':5,'shiny ore':1},{'UPGRADE':'Mineshaft (Collapsed)'},{'UPGRADE':'Underground Spring'}]}],
 'Mineshaft (Collapsed)':[],
 'Underground Spring':[{inputs:{'stone brick':80, 'labor (Hammer)':150, 'labor (Pick)':150}, outputs:{'UPGRADE':'Well'}}],
 'Well':[{inputs:{}, outputs:{'fresh water':1}}],
 'Clearing':[{inputs:{'labor (Hoe)':50}, outputs:{'UPGRADE':'Field'}},
             {inputs:{'log':50,'labor':50}, outputs:{'UPGRADE':'Hovel'}},
             {inputs:{'stone':50,'labor':50}, outputs:{'UPGRADE':'Furnace'}},
       {inputs:{'stone brick':1240,'plank':500, 'labor (Hammer)':400, 'labor (Saw)':400, 'glass':50, 'platinum':20, 'book':50, 'steel':100, 'iron':400}, outputs:{'UPGRADE':'Monastery'}}],
 'Monastery':[{inputs:{'book':5,'bread':100,'child':1,'platinum':5, 'ink':5}, outputs:{'Monk':1}}],
 'Monk':[{inputs:{}, outputs:{'labor (Wizened)':1}}],
 'Worker':[{inputs:{}, outputs:{'labor':1}},
           {inputs:{'Hoe':1}, outputs:{'UPGRADE':'Farmer'}},
     {inputs:{'Axe':1}, outputs:{'UPGRADE':'Lumberjack'}},
     {inputs:{'Pick':1}, outputs:{'UPGRADE':'Miner'}},
     {inputs:{'Saw':1}, outputs:{'UPGRADE':'Carpenter'}},
     {inputs:{'Hammer':1}, outputs:{'UPGRADE':'Mason'}}],
 'Farmer':[{inputs:{}, outputs:{'labor':1}},
       {inputs:{}, outputs:{'labor (Hoe)':1}},
     {inputs:{'unequip':1}, outputs:{'Hoe':1,'UPGRADE':'Worker'}}],
 'Lumberjack':[{inputs:{}, outputs:{'labor':1}},
       {inputs:{}, outputs:{'labor (Axe)':1}},
       {inputs:{'unequip':1}, outputs:{'Axe':1,'UPGRADE':'Worker'}}],
 'Miner':[{inputs:{}, outputs:{'labor':1}},
      {inputs:{}, outputs:{'labor (Pick)':1}},
      {inputs:{'unequip':1}, outputs:{'Pick':1,'UPGRADE':'Worker'}}],
 'Carpenter':[{inputs:{}, outputs:{'labor':1}},
        {inputs:{}, outputs:{'labor (Saw)':1}},
        {inputs:{'unequip':1}, outputs:{'Saw':1,'UPGRADE':'Worker'}}],
 'Mason':[{inputs:{}, outputs:{'labor':1}},
      {inputs:{}, outputs:{'labor (Hammer)':1}},
      {inputs:{'unequip':1}, outputs:{'Hammer':1,'UPGRADE':'Worker'}}],
 'Hovel':[{inputs:{'child':1, 'bread':100, 'book':3}, outputs:{'Worker':1}},
          {inputs:{'iron':50, 'log':100, 'stone':200, 'labor (Hammer)':50, 'labor (Saw)':50}, outputs:{'UPGRADE':'Workshop'}},
          {inputs:{'log':100, 'millstone':1, 'labor (Hammer)':100}, outputs:{'UPGRADE':'Mill'}},
      {inputs:{'plank':100, 'stone brick':100, 'labor (Hammer)':100, 'labor (Saw)':100}, outputs:{'UPGRADE':'Inn'}}],
 'Inn':[{inputs:{'labor':400, 'bread':50}, outputs:{'child':1}}],
 'Workshop':[{inputs:{'log':10, 'labor (Saw)':10, 'iron':2}, outputs:{'plank':2}},
             {inputs:{'stone':500, 'labor (Pick)':100}, outputs:{'millstone':1}},
       {inputs:{'stone':50, 'labor (Hammer)':20}, outputs:{'stone brick':5}},
       {inputs:{'paper':25, 'ink':3}, outputs:{'book':1}}],
 'Watermill':[{inputs:{'water':10, 'grain':10}, outputs:{'grain flour':10}},
          {inputs:{'water':20, 'stone':50}, outputs:[{'dull ore':2},{'dull ore':1},{'quartz':1}]},
        {inputs:{'water':10, 'quartz':1}, outputs:{'quartz dust':2}},
        {inputs:{'water':10, 'reed':5}, outputs:{'paper':5}},
        {inputs:{'water':10, 'lotus':1}, outputs:{'ink':1}}],
 'Furnace':[{inputs:{'coal':1,'dull ore':1}, outputs:{'iron':1}},
      {inputs:{'millstone':1,'plank':70, 'labor (hammer)':100}, outputs:{'UPGRADE':'Bakery'}},
            {inputs:{'iron':30,'labor':100}, outputs:{'Anvil':1}},
      {inputs:{'log':5, 'coal':1}, outputs:{'charcoal':1}},
      {inputs:{'stick':25, 'coal':1}, outputs:{'charcoal':1}},
      {inputs:{'charcoal':50, 'iron':80, 'stone brick':100, 'labor (Hammer)':200}, outputs:{'UPGRADE':'Steelworks'}}],
 'Bakery':[{inputs:{'charcoal':1,'dough':5}, outputs:{'bread':3}},
           {inputs:{'fresh water':3,'grain flour':5,'labor':5}, outputs:{'dough':5}},
     {inputs:{'grain':10,'labor':15}, outputs:{'grain flour':10}}],
 'Steelworks':[{inputs:{'charcoal':1,'dull ore':5}, outputs:{'iron':6}},
         {inputs:{'charcoal':1,'shiny ore':1}, outputs:{'platinum':1}},
       {inputs:{'charcoal':5,'iron':5}, outputs:{'steel':1}},
       {inputs:{'charcoal':1,'heavy ore':2}, outputs:{'lead':3}},
       {inputs:{'charcoal':1,'lead':3, 'quartz dust':4}, outputs:{'glass':3}}],
 'Mill':[{inputs:{'labor':5, 'grain':10}, outputs:{'grain flour':10}},
                 {inputs:{'log':100, 'plank':50, 'labor (Hammer)':100, 'iron':50}, outputs:{'UPGRADE':'Waterwheel'}}],
 'Anvil':[{inputs:{'iron':10,'stick':15,'labor':40}, outputs:[{'Axe':1},{'Hoe':1},{'Pick':1},{'Saw':1},{'Hammer':1}]},
        {inputs:{}, outputs:{'unequip':1}}],
 'Field':[{inputs:{'grain':75,'labor (Hoe)':50}, outputs:{'UPGRADE':'Grain Field (planted)'}}],
 'Grain Field (planted)':[{inputs:{'water':150}, outputs:{'UPGRADE':'Grain Field (ripe)'}}],
 'Grain Field (ripe)':[{inputs:{'labor (Hoe)':100}, outputs:{'grain':200, 'UPGRADE':'Field'}}],
 'Town Hall':[{inputs: {'stone':1}, outputs:{'stone':1}},
        {inputs: {'log':1}, outputs:{'log':1}},
        {inputs:{'stick':1}, outputs:{'stick':1}},
        {inputs:{'iron':1}, outputs:{'iron':1}},
        {inputs:{'dull ore':1}, outputs:{'dull ore':1}},
        {inputs:{'shiny ore':1}, outputs:{'shiny ore':1}},
        {inputs:{'coal':1}, outputs:{'coal':1}},
        {inputs:{'grain':1}, outputs:{'grain':1}},
        {inputs:{'child':1}, outputs:{'child':1}},
        {inputs:{'bread':1}, outputs:{'bread':1}},
        {inputs:{'dough':1}, outputs:{'dough':1}},
        {inputs:{'grain flour':1}, outputs:{'grain flour':1}},
        {inputs:{'Hoe':1}, outputs:{'Hoe':1}},
        {inputs:{'Axe':1}, outputs:{'Axe':1}},
        {inputs:{'Pick':1}, outputs:{'Pick':1}},
        {inputs:{'Saw':1}, outputs:{'Saw':1}},
        {inputs:{'Hammer':1}, outputs:{'Hammer':1}},
        {inputs:{'platinum':1}, outputs:{'platinum':1}},
        {inputs:{'quartz':1}, outputs:{'quartz':1}},
        {inputs:{'charcoal':1}, outputs:{'charcoal':1}},
        {inputs:{'steel':1}, outputs:{'steel':1}},
        {inputs:{'quartz dust':1}, outputs:{'quartz dust':1}},
        {inputs:{'glass':1}, outputs:{'glass':1}},
        {inputs:{'heavy ore':1}, outputs:{'heavy ore':1}},
        {inputs:{'lead':1}, outputs:{'lead':1}},
        {inputs:{'plank':1}, outputs:{'plank':1}},
        {inputs:{'reed':1}, outputs:{'reed':1}},
        {inputs:{'lotus':1}, outputs:{'lotus':1}},
        {inputs:{'paper':1}, outputs:{'paper':1}},
        {inputs:{'ink':1}, outputs:{'ink':1}},
        {inputs:{'child':1}, outputs:{'child':1}},
        {inputs:{'book':1}, outputs:{'book':1}},
        {inputs:{'bucket':1}, outputs:{'bucket':1}}
        ]
};

//hello kai