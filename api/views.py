from django.shortcuts import render
from django.http import JsonResponse as JR
import json
import engine.ai as ai
from django.templatetags.static import static

class JRError(JR):
	def __init__(self, message):
		JR.__init__(self, {"error" : str(message)})

class JRInfo(JR):
	def __init__(self, available_engine_list, response_format):
		JR.__init__(self, {"available_engines" : available_engine_list,
				   "response_format" : response_format})

class Engine(object):
	'''This class is designed to specify a game engine, while postponing deployment of it'''
	def __init__(self, engine_class, *args, **kwargs)
		self.engine_class = engine_class
		self.args = args
		self.kwargs = kwargs
	def spinup(self):
		return self.engine_class(*args, **kwargs)

tictactoe_engines = {
	"tictactoe_neuralnet_1" : Engine(ai.TTTNNAI, filename = static("brain1.xml")),
	"tictactoe_neuralnet_2" : Engine(ai.TTTNNAI, filename = static('brain2.xml')),
	"tictactoe_neuralnet_3" : Engine(ai.TTTNNAI, filename = static('brain3.xml')),
	"tictactoe_logicai_hard" : Engine(ai.TTTPerfectAI),
	"tictactoe_logicai_medium" : Engine(ai.TTTMediumAI),
	"tictactoe_logicai_easy" : Engine(ai.TTTEasyAI)
	}
 
tictactoe_response_format = { "engine" : "tictactoe_logicai_hard",
		              "state" : { "board" : [1,0,1,-1,-1,0,0,0,0],
					  "player": 1 }
                            } 

def _game_api(available_engines, response_format, request):
	# Load the json request body
	try:
		game = json.loads(request.body)
	except:
		return JRError("can't parse your json request")

	if "info" in game:
		return JRInfo(available_engines.values(), response_format)
		
	try:
		game_engine_name = game["engine"]
		game_state = game["state"]
	except:
		return JRError("must provide a game engine and game state")

	if game_engine_name not in available_engines:
		return JRError("no such engine")

	try:
		game_engine = available_engines[game_engine_name].spinup()
	except:
		return JRError("unable to spin up given engine... contact webmaster")

	try:
		return JR(game_engine(**game_state))
	except:
		return JRError("given engine does not understand given state.  If you are sure you have the correct format, contact webmaster")


def tictactoe(request):
	return _game_api(tictactoe_engines, tictactoe_request_format, request)	
