
class Producer:
    def __init__(self, habitants, zip, heat_src):
        self.habitants = habitants
        self.zip = zip
        self.heat_src = heat_src  #Enter 1 for natural gas, 2 for electric heat, 3 for oil, 4 for propane, 5 for wood, or 6 if you do not heat your house

        
class Source:
    def __init__(self, type):
        self.type = type